<?php

namespace App\Serializer\Normalizer;

use App\Entity\People;
use Symfony\Component\Serializer\Normalizer\CacheableSupportsMethodInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class PeopleNormalizer implements NormalizerInterface, CacheableSupportsMethodInterface
{
    private $normalizer;

    public function __construct(ObjectNormalizer $normalizer)
    {
        $this->normalizer = $normalizer;
    }

    public function normalize($object, $format = null, array $context = []): array
    {
        return [
            'id' => $object->getId(),
            'firstname' => $object->getFirstname(),
            'lastname' => $object->getLastName()
        ];
    }

    public function supportsNormalization($data, $format = null): bool
    {
        return $data instanceof People;
    }

    public function hasCacheableSupportsMethod(): bool
    {
        return true;
    }
}
